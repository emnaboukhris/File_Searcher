import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
  
// Retrieve the environment variable
const GITHUB_ACCESS_TOKEN = process.env.REACT_APP_GITHUB_ACCESS_TOKEN; 

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
