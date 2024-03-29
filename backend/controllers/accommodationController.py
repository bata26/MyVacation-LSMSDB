from managers.accommodationManager import AccommodationManager
from managers.accommodationNodeManager import AccommodationNodeManager
from managers.likeRelationManager import LikeRelationManager
from managers.userManager import UserManager
from models.accommodation import Accommodation
from models.accommodationNode import AccommodationNode
from models.userNode import UserNode
from models.likeRelation import LikeRelation
from models.accommodation import Accommodation
from models.review import Review
from managers.reviewManager import ReviewManager

# This class contains methods reguarding the Accommodations behavior. Methods described here 
# are responsible for calling the underlay layer (Manager) and perform
# different kind of operations like: CRUD, statistic and so on.
class AccommodationController:

    @staticmethod
    def getTopAdvInfo(acommodationsID):
        try:
            result = AccommodationManager.getAccommodationsFromIdList(acommodationsID)
            return result
        except Exception as e:
            raise Exception(str(e))
    
    @staticmethod
    def deleteAccommodationById(accommodationID, user):
        try:
            deleteResult = AccommodationManager.deleteAccommodation(accommodationID, user)
        except Exception as e:
            raise Exception(str(e))
        try:
            if deleteResult:
                AccommodationNodeManager.deleteAccommodationNode(accommodationID)
                return True
        except Exception as e:
            return False
    
    @staticmethod
    def updateAccommodation(accommodationID, formData, user):
        try:
            AccommodationManager.updateAccommodation(accommodationID, formData, user)
        except Exception as e:
            raise Exception(str(e))
        try:
            accomodationNode = AccommodationNode(
                accommodationID,
                formData["name"],
                formData["approved"]
            )
            AccommodationNodeManager.updateAccommodationNode(accomodationNode)
            return True
        except Exception as e:
            return False
    
    @staticmethod
    def getAccommodationById(accommodationID):
        try:
            res = AccommodationManager.getAccommodationFromId(accommodationID)
            return res
        except Exception as e:
            raise Exception(str(e))
    
    @staticmethod
    def getFilteredAccommodations(start_date, end_date, city, guests, index, direction):
        try:
            res = AccommodationManager.getFilteredAccommodations(start_date, end_date, city, guests, index, direction)
            return res
        except Exception as e:
            raise Exception(str(e))
    
    @staticmethod
    def insertAccommodation(formData , user):
        try:
            host = UserManager.getUserFromID(user["_id"])
            pictures = []
            imagesLength = formData["imagesLength"]
            for i in range(1, int(imagesLength)):
                pictures.append(formData["img"][i])

            location = {
                "address": formData["address"],
                "city": formData["city"],
                "country": formData["country"],
            }
            accommodation = Accommodation(
                formData["name"],
                formData["description"],
                host["_id"],
                host["name"],
                formData["img"][0],
                location,
                formData["propertyType"],
                formData["guests"],
                formData["bedrooms"],
                formData["beds"],
                formData["price"],
                False,
                pictures=pictures,
            )
    
            accommodationID = AccommodationManager.insertNewAccommodation(accommodation)
            if user["role"] != "host":
                updatedRole = {"type": "host"}
                UserManager.updateUser(updatedRole, host["_id"])
            return {"accommodationID": str(accommodationID)}
        except Exception as e:
            return str(e), 500
    
    @staticmethod
    def insertReview(requestBody , user):
        try:
            destinationID =  requestBody["destinationID"]
            review = Review(
                user["_id"],
                destinationID,
                requestBody["score"],
                requestBody["description"],
                requestBody["reviewer"],
            )
            ReviewManager.insertNewReview(review , destinationID , "accommodation")
        except Exception as e:
            return str(e), 200
    
    @staticmethod
    def refuseAccommodation(accommodationID , user):
        try:
            AccommodationManager.deleteAccommodation(accommodationID, user)
        except Exception as e:
            return str(e), 200
        try:
            AccommodationNodeManager.deleteAccommodationNode(accommodationID)
            return True
        except Exception as e:
            return False
    
    @staticmethod
    def getAccommodationsByUserID(userID):
        try:
            res = AccommodationManager.getAccommodationsByUserID(userID)
            return res
        except Exception as e:
            return str(e), 200
    
    @staticmethod
    def likeAccommodation(requestBody , user):
        try:
            accommodationNode = AccommodationNode(requestBody["likedAdvID"], requestBody["likedAdvName"])
            userNode = UserNode(user["_id"], user["username"])
            likeRelation = LikeRelation(userNode, accommodationNode=accommodationNode)
            LikeRelationManager.addLikeRelation(likeRelation)
        except Exception as e:
            return str(e), 200
    
    @staticmethod
    def dislikeAccommodation(requestBody , user):
        try:
            userNode = UserNode(user["_id"], user["username"])
            accommodationNode = AccommodationNode(requestBody["unlikedAdvID"], requestBody["unlikedAdvName"])
            likeRelation = LikeRelation(userNode, accommodationNode=accommodationNode )
            LikeRelationManager.removeLikeRelation(likeRelation)
        except Exception as e:
            return str(e), 200
    
    @staticmethod
    def getCommonAccommodation(user , userID):
        try:
            userNode = UserNode(user["_id"], user["username"])
            res = AccommodationNodeManager.getCommonLikedAccommodation(userNode, userID)
            return res
        except Exception as e:
            return str(e), 200
    
    @staticmethod
    def getTotalLikes(destinationID):
        try:
            res =  AccommodationNodeManager.getTotalLikes(destinationID)
            return {"likes" : res}
        except Exception as e:
            return str(e), 200