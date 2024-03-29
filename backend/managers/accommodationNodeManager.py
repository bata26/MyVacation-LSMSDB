from utility.serializer import Serializer
from models.accommodationNode import AccommodationNode
from utility.graphConnection import GraphManager

# Class that represents the manager for the accommodation node stored in graph database. 
# Methods implements query and serialization of object.
class AccommodationNodeManager:

    # method that creates a node if it doesn't exists or update his property if it exists.
    @staticmethod
    def createAccommodationNode(accommodationNode):
        client = GraphManager.getInstance()
        try:
            with client.session() as session:
                checkQuery = "MATCH (a:Accommodation {accommodationID : '%s'}) return COUNT(a) as total" %accommodationNode.accommodationID
                checkResult = list(session.run(checkQuery))[0]

                # the node doesn't exists, create it
                if checkResult.value("total") == 0:
                    query = "CREATE (a:Accommodation {accommodationID: '%s', name: '%s'})" % (
                        accommodationNode.accommodationID, accommodationNode.name)
                    session.run(query)
                
                # the node already exists               
                else:
                    AccommodationNodeManager.updateAccommodationNode(accommodationNode)

        except Exception as e:
            raise Exception(
                "Impossibile inserire il nodo accommodation: " + str(e))

    @staticmethod
    def deleteAccommodationNode(accommodationNodeID):
        client = GraphManager.getInstance()
        try:
            with client.session() as session:
                query = "MATCH (a:Accommodation {accommodationID: '%s'}) DELETE a" %accommodationNodeID
                session.run(query)

        except Exception as e:
            raise Exception("Impossibile eliminare il nodo accommodation: " + str(e))

    @staticmethod
    def updateAccommodationNode(accommodationNode):
        client = GraphManager.getInstance()
        try:
            with client.session() as session:
                query = "MATCH (a:Accommodation {accommodationID: '%s'}) SET a.name='%s' , a.approved = %s" % (
                    accommodationNode.accommodationID, accommodationNode.name , accommodationNode.approved)
                session.run(query)

        except Exception as e:
            raise Exception("Impossibile aggiornare il nodo accommodation: " + str(e))

    # method that returns the total number of likes received by a specific accommodation
    @staticmethod
    def getTotalLikes(accommodationID):
        client = GraphManager.getInstance()
        try:
            with client.session() as session:
                query = "MATCH(a: Accommodation)<-[r:LIKE]-(u: User) WHERE a.accommodationID = '%s' return COUNT(r) as total" % accommodationID
                result = list(session.run(query))[0]
                return result.value("total")

        except Exception as e:
            raise Exception(
                "Impossibile ottenere totale likes: " + str(e))

    # method that from two userNode, returns a list of accommodations that both users like
    @staticmethod
    def getCommonLikedAccommodation(firstUserNode, secondUserID):
        client = GraphManager.getInstance()
        try:
            with client.session() as session:
                query = "MATCH(u1: User {userID: '%s' })-[:LIKE]->(a: Accommodation)<-[:LIKE]-(u2: User {userID: '%s' }) WHERE a.approved=True return a" % (
                    firstUserNode.userID, secondUserID)
                queryResult = list(session.run(query))
                result = []
                
                for item in queryResult:
                    node = item.get("a")
                    accommodationNode = AccommodationNode(node["accommodationID"], node["name"])
                    result.append(Serializer.serializeAccommodationNode(accommodationNode))
                
                return result
        except Exception as e:
            raise Exception(
                "Impossibile eseguire la query: " + str(e))