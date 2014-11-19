Pokedex.Router = Backbone.Router.extend({
  routes: {
		"": "pokemonIndex",
		"pokemon/:id": "pokemonDetail",
		"pokemon/:pokemonId/toys/:toyId" : "toyDetail"
  },
	
	pokemonForm: function () {
		var pokemonForm = new Pokedex.Views.PokemonForm({
			model: new Pokedex.Models.Pokemon(), 
			collection: this._pokemonIndex.collection
		});  
		pokemonForm.render();
		$('#pokedex .pokemon-form').append(pokemonForm.$el);	
			
	},

  pokemonDetail: function (id, callback) {
		$("#pokedex .toy-detail").empty();
		if(!this._pokemonIndex) {
			this.pokemonIndex((function () {
				this.pokemonDetail(id, callback);
			}.bind(this)));
			return;
		}
		var pokemon = this._pokemonIndex.collection.models[id - 1];
		var pokemonDetail = new Pokedex.Views.PokemonDetail({
			model: pokemon
		});
		$("#pokedex .pokemon-detail").empty().append(pokemonDetail.$el);
		pokemonDetail.refreshPokemon(callback);
		this._pokemonIndex.refreshPokemon();
		this._pokemonDetail = pokemonDetail;
	},

  pokemonIndex: function (callback) {
	  this._pokemonIndex = new Pokedex.Views.PokemonIndex();
	  this._pokemonIndex.refreshPokemon(callback);
		$("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
		this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId, callback) {
		if(!this._pokemonDetail) {
			this.pokemonDetail(pokemonId, (function () {
				this.toyDetail(pokemonId, toyId, callback);
			}.bind(this)));
			return;
		}
		var toyDetail = new Pokedex.Views.ToyDetail();
		var toy = this._pokemonDetail.model.toys().get(toyId);
		toyDetail.render(toy);
		$("#pokedex .toy-detail").empty().append(toyDetail.$el);
		
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});

