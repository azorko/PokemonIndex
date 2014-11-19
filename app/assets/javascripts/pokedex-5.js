Pokedex.Views = {};

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
		"click li.poke-list-item" : "selectPokemonFromList"
  },

  initialize: function () {
		this.collection = new Pokedex.Collections.Pokemon();
  },

  addPokemonToList: function (pokemon) {
		var content = JST['pokemonListItem']({pokemon: pokemon});
		this.$el.append(content);
  },

  refreshPokemon: function (callback, options) {
		var that = this;
		this.collection.fetch({
			success: (function () {
				that.render();
				if (callback) {
				  callback();
			  }
			}) 
		});
  },

  render: function () {
		this.$el.empty();
		this.collection.forEach( (function (pokemon) {
			this.addPokemonToList(pokemon);
		}).bind(this));
		return this;
  },

  selectPokemonFromList: function (event) {
		
		var pokemonId = $(event.currentTarget).data("id");
		Backbone.history.navigate("pokemon/" + pokemonId, {trigger: true});
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
		"click li.toy-list-item" : "selectToyFromList"
  },

  refreshPokemon: function (callback, options) {
		
		var that = this
		this.model.fetch({
			success: function() {
				that.render(); 
				if (callback) {
					callback();
				}
			}
		});
  },

  render: function () {
		var content = JST['pokemonDetail']({pokemon: this.model});
		this.$el.html(content);
		this.model.toys().forEach( (function (toy) {
			var toyItem = JST['toyListItem']({toy: toy});
			this.$el.append(toyItem);
		}).bind(this));
		return this;
  },

  selectToyFromList: function (event) {
		
		var toyId = $(event.currentTarget).data("id");
		var pokemonId = $(event.currentTarget).data("pokemon-id");
		Backbone.history.navigate("pokemon/" + pokemonId + "/toys/" + toyId, {trigger: true});
		

  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  render: function (toy) {
		var content = JST['toyDetail']({toy: toy, pokes: []});
		this.$el.append(content);
		return this; 
  }
});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
		"submit form" : "savePokemon"
  },
	
  render: function () {
		var content = JST['pokemonForm']();
		this.$el.append(content);
		return this; 
  },
	
	savePokemon: function (event) {
		event.preventDefault();
		var pokeAttrs = $(event.currentTarget).serializeJSON().pokemon;
		var pokemon = new Pokedex.Models.Pokemon(pokeAttrs);
		pokemon.save({}, {
			success: (function() {
				this.collection.add(pokemon);
				Backbone.history.navigate("pokemon/" + pokemon.get("id"), {trigger: true});
			}).bind(this)
		});
	}
});