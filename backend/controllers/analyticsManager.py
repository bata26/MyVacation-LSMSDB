from .connection import MongoManager
import os
import datetime


from bson.objectid import ObjectId




class AnalyticsManager:
    @staticmethod
    def getReservationByMonth(user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("RESERVATIONS_COLLECTION")]
        try:
            result = list(collection.aggregate(([
                {"$match": {"hostID": ObjectId(
                    user["_id"]), "destinationType": "accomodation"}},
                {"$group": {
                    "_id": {
                        "city": "$city",
                        "month": {"$month": "$startDate"}
                    },
                    "count": {"$count": {}}
                }},
                {"$project": {"total": "$count", "month": "$_id.month",
                              "_id": 0, "city": "$_id.city"}},
                {"$group": {
                    "_id": "$city",
                    "stats": {
                        "$push": {
                            "month": "$month",
                            "total": "$total"
                        }
                    }
                }},
                {"$project": {"_id": 0, "city": "$_id", "stats": "$stats"}}
            ])))
            return result
        except Exception as e:
            print("Impossibile eseguire la query: " + str(e))

    @staticmethod
    def getUsersForMonth():
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("USERS_COLLECTION")]
        year = datetime.datetime.now().year
        try:
            result = list(collection.aggregate([
                {"$match":
                 {"$expr":
                  {
                      "$eq": [{"$year": "$registrationDate"}, year]
                  }
                  }
                 },
                {
                    "$group": {
                        "_id": {"$month": "$registrationDate"},
                        "users": {
                            "$count": {}
                        }
                    }
                },
                {
                    "$project": {"month": "$_id", "users": "$users", "_id": 0}
                }]))

            print(result)
        except Exception as e:
            raise Exception("Impossibile ottenere: " + str(e))

    # Ottieni i tre annunci più prenotati di sempre

    @staticmethod
    def getTopAdv():
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        accomodationsCollection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        activitiesCollection = db[os.getenv("ACTIVITIES_COLLECTION")]
        try:

            accomodationsResult = list(accomodationsCollection.aggregate([
                {"$group": {"_id": "$reservations", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
            ]))

            activitiesResult = list(activitiesCollection.aggregate([
                {"$group": {"_id": "$reservations", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
            ]))

            print(accomodationsResult)
            print(activitiesResult)

        except Exception as e:
            raise Exception("Impossibile ottenere: " + str(e))

    # Ottieni le tre città con più prenotazioni nell'ultimo mese (data da rivedere)
    @staticmethod
    def getTopCities():
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("RESERVATIONS_COLLECTION")]
        month = datetime.datetime.now().month
        try:
            result = list(collection.aggregate([
                {"$match":
                 {"$expr":
                  {
                      "$eq": [{"$month": "$startDate"}, month]
                  }
                  }
                 },
                {"$group": {"_id": "$city", "count": {"$sum": 1}}},
                {"$project" : {"city" : "$_id" , "_id" : 0 , "total" : "$count"}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
                ]))
            return result
        except Exception as e:
            print("impossibile ottenere: " + str(e))
    
    @staticmethod
    def getAccomodationAverageCost(user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        try:
            result = list(collection.aggregate([
                {"$group":
                 {
                     "_id": "$location.city",
                     "averageCost": {"$avg": "$price"}
                 }
                 },
                {"$project": {"_id": 0, "city": "$_id", "averageCost": 1}}

            ]))
            return result
        except Exception as e:
            print("Impossibile eseguire la query: " + str(e))

    
    @staticmethod
    def getActivityAverageCost(user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]
        try:
            result = list(collection.aggregate([
                {"$group":
                 {
                     "_id": "$location.city",
                     "averageCost": {"$avg": "$price"}
                 }
                 },
                {"$project": {"_id": 0, "city": "$_id", "averageCost": 1}}

            ]))
            return result
        except Exception as e:
            print("Impossibile eseguire la query: " + str(e))

    # Ottieni i tre annunci più prenotati di sempre

    @staticmethod
    def getTopAdv():
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        accomodationsCollection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        activitiesCollection = db[os.getenv("ACTIVITIES_COLLECTION")]
        try:

            accomodationsResult = list(accomodationsCollection.aggregate([
                {"$group": {"_id": "$reservations", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
            ]))

            activitiesResult = list(activitiesCollection.aggregate([
                {"$group": {"_id": "$reservations", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
            ]))

            print(accomodationsResult)
            print(activitiesResult)

        except Exception as e:
            raise Exception("Impossibile ottenere: " + str(e))

    # Ottieni le tre città con più prenotazioni nell'ultimo mese (data da rivedere)
    @staticmethod
    def getTopCities():
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("RESERVATIONS_COLLECTION")]
        month = datetime.datetime.now().month
        try:

            result = list(collection.aggregate([
                {"$match":
                 {"$expr":
                  {
                      "$eq": [{"$month": "$startDate"}, month]
                  }
                  }
                 },
                {"$group": {"_id": "$city", "count": {"$sum": 1}}},
                {"$project" : {"city" : "$_id" , "_id" : 0 , "total" : "$count"}},
                {"$sort": {"count": -1}},
                {"$limit": 3}
                ]))
    @staticmethod
    def getAccomodationAverageCost(user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
        try:
            result = list(collection.aggregate([
                {"$group":
                 {
                     "_id": "$location.city",
                     "averageCost": {"$avg": "$price"}
                 }
                 },
                {"$project": {"_id": 0, "city": "$_id", "averageCost": 1}}

            ]))
            return result
        except Exception as e:
            print("Impossibile eseguire la query: " + str(e))

    
    @staticmethod
    def getActivityAverageCost(user):
        client = MongoManager.getInstance()
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("ACTIVITIES_COLLECTION")]
        try:
            result = list(collection.aggregate([
                {"$group":
                 {
                     "_id": "$location.city",
                     "averageCost": {"$avg": "$price"}
                 }
                 },
                {"$project": {"_id": 0, "city": "$_id", "averageCost": 1}}

            ]))
            return result
        except Exception as e:
            print("Impossibile eseguire la query: " + str(e))
                

            print(result)

        except Exception as e:
            raise Exception("Impossibile ottenere: " + str(e))

        @staticmethod
        def getTotReservations(user):
            client = MongoManager.getInstance()
            db = client[os.getenv("DB_NAME")]
            collection = db[os.getenv("RESERVATIONS_COLLECTION")]
            result = None
            try:
                if(user["role"] == "admin"):
                    result = collection.aggregate([
                        {
                            '$count': '{}'
                        }
                    ])
                else:
                    result = collection.aggregate([
                        {
                            '$match': {
                                'hostID': ObjectId(user["_id"])
                            }
                        }, {
                            '$count': '{}'
                        }
                    ])
                return result
            except Exception as e:
                print("Impossibile eseguire la query: " + str(e))\

        @staticmethod
        def getTotAdvs(user):
            client = MongoManager.getInstance()
            db = client[os.getenv("DB_NAME")]
            accomodationCollection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
            activityCollection = db[os.getenv("ACTIVTIES_COLLECTION")]
            result = None
            try:
                if(user["role"] == "admin"):
                    resultAcc = accomodationCollection.aggregate([
                        {
                            '$count': '{}'
                        }
                    ])
                    resultAct = activityCollection.aggregate([
                        {
                            '$count': '{}'
                        }
                    ])
                    result = resultAct + resultAcc
                else:
                    resultAcc = accomodationCollection.aggregate([
                        {
                            '$match': {
                                'hostID': ObjectId(user["_id"])
                            }
                        }, {
                            '$count': '{}'
                        }
                    ])
                    resultAct = activityCollection.aggregate([
                        {
                            '$match': {
                                'hostID': ObjectId(user["_id"])
                            }
                        }, {
                            '$count': '{}'
                        }
                    ])
                    result = resultAcc + resultAct
                return result
            except Exception as e:
                print("Impossibile eseguire la query: " + str(e))

        @staticmethod
        def getBestAdvertisers(destinationType):
            client = MongoManager.getInstance()
            db = client[os.getenv("DB_NAME")]
            if(destinationType == "accomodation"):
                collection = db[os.getenv("ACCOMODATIONS_COLLECTION")]
            else:
                collection = db[os.getenv("ACTIVTIES_COLLECTION")]
            try:
                result = collection.aggregate([
                    {'$group': {'_id': '$hostID','avg': {'$avg': '$review_scores_rating'}}},
                    {'$sort': {'avg': -1} },
                    {'$limit': 10}
                ])
                return result
            except Exception as e:
                print("Impossibile eseguire la query: " + str(e))


