const graphql = require("graphql");
const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList
} = graphql;

const LyricType = new GraphQLObjectType({
	name:'Lyrics',
	fields:()=> ({
		id 		:{type: GraphQLString},
		songLirics: {type: GraphQLString}
	})
});

const SongType =  new GraphQLObjectType({
	name:'Songs',
	fields:()=> ({
		id  	: {type: GraphQLString},
		title	: {type: GraphQLString},
		artist	: {type: GraphQLString},
		lyricsId: {type: GraphQLString},
		lyrics: {
			type: LyricType,
			resolve(parentValue,args) {
				console.log(parentValue);
				return axios.get(`http://localhost:3000/lyrics/${parentValue.lyricsId}`).
							then(res=>res.data);
			}
		}
	})
});

const RootQuery =  new GraphQLObjectType({
	name:"RootQueryType",
	fields: {
		Songs: {
			type: new GraphQLList(SongType),
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/songs`)
						.then(res=>res.data)
			}
		},
		Song: {
			type: SongType,
			args: {
				id: {type: GraphQLString}
			},
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/songs/${args.id}`)
						.then(res=>res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query:RootQuery
});