const common = {
  labels: {
    search: "Search",
  },
  header: {
    sign_in: "Sign In",
    sign_out: "Log Out",
    sign_up: "Sign Up",
    favorite: "View Favorites",
    sign_in_error: "Username or Password is incorrect",
    sign_up_error: "Username already taken",
    sign_in_modal_input_1: "Username",
    sign_in_modal_input_2: "Password",
    sign_up_modal_input_1: "Create Username",
    sign_up_modal_input_2: "Create Password",
  },
  modalErrors: {
    keys: {
      username: "username",
      password: "password",
      signInSubmit: "sign_in",
      signUpSubmit: "sign_up",
    },
    errors: {
      required: "Field is required",
      spaces: "No spaces allowed",
      signInSubmit: "Username or Password is incorrect",
      signUpSubmit: "Username already taken",
    },
  },
  footer: {
    copyright: "@copyright 2023 Anthony Massaad",
  },
  filter: {
    basic: {
      searchPlaceHolder: "Pokemon Name",
      additionalInfo: "Use the Advanced Search to search Pokémon by type!",
      clarification: "Search Pokémons by their name",
    },
  },
  pokemonTypes: [
    "Bug",
    "Dragon",
    "Fairy",
    "Fire",
    "Ghost",
    "Ground",
    "Normal",
    "Psychic",
    "Steel",
    "Dark",
    "Electric",
    "Fighting",
    "Flying",
    "Grass",
    "Ice",
    "Poison",
    "Rock",
    "Water",
  ],
};

export default common;
