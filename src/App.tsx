import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';

import ResultsPage from './ResultsPage';
import { ResultViewProps } from './ResultView';

function App(): JSX.Element {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ResultViewProps[]>([]);

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const getResults = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const resp: { data: ResultViewProps[] } = await Axios.post("api/db", {q: query});
      setResults(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
<Container>
  <Form onSubmit={getResults}>
    <Form.Group controlId="search-input" className="w-100">
      <Form.Control type="text" value={query} onChange={setValue} />
    </Form.Group>
  </Form>
  <ResultsPage results={results}/>
</Container>
  );
}

export default App;
