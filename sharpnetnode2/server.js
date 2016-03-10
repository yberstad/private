import express from 'express';
//import schema from './data/schema';
import TestClass from './data/testdebug'
import GraphQLHTTP from 'express-graphql';

import {MongoClient} from 'mongodb';
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLString
} from 'graphql';

let Schema = (db) => {

    let linkType = new GraphQLObjectType({
        name: 'Link',
        fields: () => ({
            _id: { type: GraphQLString },
            title: { type: GraphQLString },
            url: { type: GraphQLString }
        })
    });

    let schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: () => ({
                links: {
                    type: new GraphQLList(linkType),
                    resolve: () => {
                        const inst = new TestClass();
                        inst.logFuncition('messagetext');
                        return db.collection("links").find({}).toArray();
                    }
                }
            })
        })
    });

    function logger(){
        "use strict";
        console.log('joggu');
    }

    return schema
};

let app = express();
app.use(express.static('public'));

let db;
MongoClient.connect('mongodb://ohabbers:dykk12@ds042898.mongolab.com:42898/dbgira', (err, database) => {
  if (err) throw err;

  db = database;
  app.use('/graphql', GraphQLHTTP({
    schema: Schema(db),
    graphiql: true
  }));
  app.listen(3000, () => 
  console.log('Listening on port 3000   '));
});

 if(true){
      console.log('jaggu');
     const inst = new TestClass();
     inst.logFuncition('messagetext');
  }
