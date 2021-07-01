import datetime
import time
import json
import sys
import cv2
import numpy as np
import base64
import os

from library.redis_serializer import redis_cache
client = redis_cache(mode=0) # mode 1 : pickle, mode 2:pyarrow

from dotenv import load_dotenv
load_dotenv

from api import *

import database.db as db
database = db.databases()

def saveToJPG(base64Image):
    ss = client.get('snapshot')
    # print('ss =', type(ss))
    try:
        imageFolderPath = "/home/qlue/.img_file/"
        try:
            mode = 0o777
            os.mkdir(imageFolderPath,mode)
        except:
            pass
        im_bytes = base64.b64decode(base64Image)
        im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
        img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
        img = cv2.resize(img,(125,200))
        imageID = uuid.uuid4().hex
        imgname = imageFolderPath + f"{imageID}.jpg"
        # print('im =', type(img), img.shape, img.size)
        print(f'img name   --> {imgname}')
        cv2.imwrite(imgname, img)
        return imageID
    except Exception as e:
        print(f"error in saving to JPG reason: {e}")
        return None


def postAPI():
    distance, temperature, mask_status, amb_temps, \
    obj_temps, mask_probs, snapshot_bbox, snapshot_b64, \
    backlight_cond, processing_time, rfid_id = get_QT_FMD_data(client)
    # print("data       -->", \
    #     distance, temperature, mask_status, amb_temps, \
    #     obj_temps, mask_probs, \
    #     backlight_cond, processing_time, rfid_id
    # )
    # print("img base64 -->", len(snapshot_b64), len(snapshot_bbox))
    snapshot_b64 = client.get('sim_img_base64')
    # client.set('sim_img_base64', snapshot_b64)
    timestamp = datetime.datetime.now()

    body = {
        "distance" : distance,
        "temperature" : temperature,
        "room_temperature": amb_temps,
        "captured_temperature": obj_temps,
        "is_masked" : mask_status,
        "is_masked_probability" : mask_probs,
        "bounding_box" : snapshot_bbox,
        "backlight_cond" : backlight_cond,
        "lat" : -6.100231,
        "lng" : 106.1973002,
        "image_base64" : '-',
        "timestamp" : timestamp,
        "device_id": device_id,
        "smart_device_id": smart_device_id,
        "device_location_id": device_location_id,
        "imageURL": None,
        "processing_time":0.0,
        "person_id": None,
        "person_type": None,
        "person_similarity": 0.0,
        "person_name":"-",
        "rfid_id": rfid_id,
        "imageID": saveToJPG(str(snapshot_b64)),
        "transactionID":str(uuid.uuid4()),
        "software_version": 'v3.0.2.1',
        "person_id": None ,
        "person_type": None,
        "person_similarity": 0.0,
        "person_name": '-',
        "processing_time":processing_time,
        "imageURL": 'https://qwprd.s3.ap-southeast-1.amazonaws.com/1624867888449'

    }
    print(timestamp, body['transactionID'])

    database.insert_data_db(body)
    
# for i in range(2000):
#     print(i+1)
#     print('---------------------------------------------------------')
#     postAPI()
#     time.sleep(1)
