from .connection import MongoManager
import os
from models.activity import Activity
from bson.objectid import ObjectId
from utility.serializer import Serializer

class ActivityManager:

    @staticmethod
    def getActivityFromID(activityID):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]
        cursor = dict(collection.find_one({"_id" : ObjectId(activityID)}))
        activity = Activity(
            str(cursor["_id"]) ,
            cursor["host_id"] ,
            cursor["host_url"] ,
            cursor["host_name"] ,
            cursor["host_picture"] ,
            cursor["location"] ,
            cursor["description"] ,
            cursor["prenotations"] ,
            cursor["duration"] ,
            cursor["pricePerPerson"] ,
            cursor["number_of_reviews"] ,
            cursor["review_scores_rating"])
        return Serializer.serializeActivity(activity)


    @staticmethod
    def insertNewActivity(activity):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]
        try:
            collection.insert_one(activity.getDictToUpload())
        except Exception:
            raise Exception("Impossibile inserire")


    @staticmethod
    def deleteActivity(activityID , user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]

        if (user["type"] != "admin"):
            activity = collection.find_one({"_id" : ObjectId(activityID)})
            if(activity.host_id != user._id):
                raise Exception("L'utente non possiede l'activity")
        try:
            res = collection.delete_one({"_id" : ObjectId(activityID)})
            return res
        except Exception:
            raise Exception("Impossibile inserire")


    @staticmethod
    def getFilteredActivity(start_date = "" , end_date = "" , city="" , guestNumbers=""):
        query = {}
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        occupiedActivitiesID = []
        result = []

        if(city != ""):
            query["city"] = city
        if(guestNumbers != ""):
            query["accomodates"] = {}
            query["accomodates"]["$gte"] = guestNumbers
        
        # Deve essere stato inserito il periodo di svolgimento
        if(start_date != ""):
            collection = db[os.getenv("PRENOTATIONS_COLLECTION")]
            occupiedActivitiesID = collection.distinct("destinationId" , 
            {"startDate" : start_date}
            )
        query["_id"] = {}
        query["_id"]["$nin"] = occupiedActivitiesID
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]
        activities = list(collection.find(query))
        for activity in activities:
            print(activity["_id"])
            print(str(activity["_id"]))
            activityResults = Activity(
                str(activity["_id"]) ,
                activity["host_id"] ,
                activity["host_url"] ,
                activity["host_name"] ,
                activity["host_picture"] ,
                activity["location"] ,
                activity["description"] ,
                activity["prenotations"] ,
                activity["duration"] ,
                activity["pricePerPerson"] ,
                activity["number_of_reviews"] ,
                activity["review_scores_rating"])   
            result.append(Serializer.serializeActivity(activityResults))
        return result