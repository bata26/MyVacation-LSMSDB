from .connection import MongoManager
import os
from models.accomodation import Accomodation
from bson.objectid import ObjectId
from utility.serializer import Serializer
from models.accomodationReservation import AccomodationReservation
from models.activityReservation import ActivityReservation
from datetime import datetime
import dateparser

class ReservationManager:

    
    @staticmethod
    def book(announcement , startDate ,  user , type, endDate=""):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("RESERVATIONS_COLLECTION")]

        startDatetime = dateparser.parse(startDate)
        if(type == "accomodation"):
            endDatetime = dateparser.parse(endDate)
            nightNumber = (((endDatetime - startDatetime).days) - 1)
            totalExpense = nightNumber*announcement["price"]
            reservation = AccomodationReservation(user["_id"] , announcement["_id"] , type , startDatetime , endDatetime , totalExpense)
        else:
            totalExpense = announcement["price"]
            reservation = ActivityReservation(user["_id"] , announcement["_id"] , type , startDatetime , totalExpense)
        try:
            res = collection.insert_one(reservation.getDictToUpload())
            print(f"risultato insert: {res}")
            return res
        except Exception as e:
            raise Exception("Impossibile prenotare: " + str(e) )