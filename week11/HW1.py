import pymongo

#Create and clear new database
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
mycol = mydb["customers"]
x = mycol.delete_many({})

#Insert values
list = [
    { "firstName": "John", "lastName": "Doe", "email": "jd123@gmail.com", "phone": "808-123-4567" },
    { "firstName": "Jane", "lastName": "Eyre", "email": "je123@aol.com", "phone": "808-456-7890" },
    { "firstName": "Bob", "lastName": "Newhart", "email": "bn@hotmail.com", "phone": "808-124-8329" }
]

#print objects
x = mycol.insert_many(list)
print(x)

#Update fields
myquery = { "email": "jd123@gmail.com" }
newvalues = { "$set": { "email": "cooldude808@gmail.com" } }
mycol.update_one(myquery, newvalues)

myquery = { "phone": "808-456-7890" }
newvalues = { "$set": { "phone": "808-521-1111" } }
mycol.update_one(myquery, newvalues)

#print "customers" after the update:
print("Fields after updates:")
for x in mycol.find():
  print(x)

#Queries
print("Query first name Bob:")
myquery = { "firstName": "John" }
mydoc = mycol.find(myquery)
for x in mydoc:
  print(x)

print("Query last name Eyre:")
myquery = { "lastName": "Eyre" }
mydoc = mycol.find(myquery)
for x in mydoc:
  print(x)

#drop collection
mycol.drop()
