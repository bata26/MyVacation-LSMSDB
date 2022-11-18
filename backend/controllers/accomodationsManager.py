from .connection import MongoManager
import os
from models.accomodation import Accomodation
from bson.objectid import ObjectId

class AccomodationsManager:

    @staticmethod
    def getAccomodationsFromId(accomodationID):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        cursor = dict(collection.find_one({"_id" : ObjectId(accomodationID)}))
        accomodation = Accomodation(
                                str(cursor["_id"]),
                                cursor["name"] ,
                                cursor["description"] ,
                                cursor["picture_url"] ,
                                cursor["host_id"] ,
                                cursor["host_url"] ,
                                cursor["host_name"] ,
                                cursor["host_since"] ,
                                cursor["host_picture_url"] ,
                                cursor["location"] ,
                                cursor["property_type"] ,
                                cursor["accommodates"] ,
                                cursor["bathrooms"] ,
                                cursor["bedrooms"] ,
                                cursor["beds"] ,
                                cursor["price"] ,
                                cursor["minimum_nights"] ,
                                cursor["number_of_reviews"] ,
                                cursor["review_scores_rating"])
        return accomodation
        #cursor["_id"] = str(cursor["_id"])
        #return cursor

    # we can filter for:
    #   - start date
    #   - end date
    #   - city
    #   - number of guests
    @staticmethod
    def getFilteredAccomodation(start_date = "" , end_date = "" , city="" , guestNumbers=""):
        query = {}
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        occupiedAccomodationsID = []
        result = []

        if(city != ""):
            query["city"] = city
        if(guestNumbers != ""):
            query["accomodates"] = {}
            query["accomodates"]["$gte"] = guestNumbers
        
        # se inserisce la data iniziale deve per forza esserci anche la data finale (la validazione verrà fatta sulla richiesta)
        if(start_date != "" and end_date != ""):
            # ottengo una lista di id di accomodations non occupate
            # faccio una query per tutti gli id che non sono nella lista e che matchano per città e ospiti
            collection = db[os.getenv("PRENOTATIONS_COLLECTION")]
            occupiedAccomodationsID = collection.distinct("destinationId" , { "$or" : [
                    {"$and" : [
                        { "start_date" : { "$lte" : end_date}},
                        { "start_date" : { "$gte" : start_date}}
                    ]} ,
                    {"$and" : [
                        { "end_date" : { "$lte" : end_date}},
                        { "end_date" : { "$gte" : start_date}}
                    ]} 
            ]})
        query["_id"] = {}
        query["_id"]["$nin"] = occupiedAccomodationsID
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        accomodations = list(collection.find(query))
        for accomodation in accomodations:
            accomodationResult = Accomodation(
                                str(accomodation["_id"]) ,
                                accomodation["name"] ,
                                accomodation["description"] ,
                                accomodation["picture_url"] ,
                                accomodation["host_id"] ,
                                accomodation["host_url"] ,
                                accomodation["host_name"] ,
                                accomodation["host_since"] ,
                                accomodation["host_picture_url"] ,
                                accomodation["location"] ,
                                accomodation["property_type"] ,
                                accomodation["accommodates"] ,
                                accomodation["bathrooms"] ,
                                accomodation["bedrooms"] ,
                                accomodation["beds"] ,
                                accomodation["price"] ,
                                accomodation["minimum_nights"] ,
                                accomodation["number_of_reviews"] ,
                                accomodation["review_scores_rating"])
            result.append(accomodationResult)
        return result
        
    @staticmethod
    def insertNewAccomodation(accomodation):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        try:
            collection.insert_one(accomodation.getDictToUpload())
        except Exception:
            raise Exception("Impossibile inserire")


    @staticmethod
    def deleteAccomodation(accomodationID , user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]

        if (user["type"] != "admin"):
            accomodation = collection.find_one({"_id" : ObjectId(accomodationID)})
            if(accomodation.host_id != user._id):
                raise Exception("L'utente non possiede l'accomodations")
        try:
            res = collection.delete_one({"_id" : ObjectId(accomodationID)})
            return res
        except Exception:
            raise Exception("Impossibile inserire")