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

    const definitions = await Axios.get("api/definitions", {params: {q: query}});
    let images = []
    try {
      const resp = await Axios.get("api/images", {params: {q: query}});
      console.log(resp)
      images = resp.data.value.slice(0, 4).map((i: {contentUrl: string}) => i.contentUrl);
    } catch (error) {
      console.log(error);
    }

    if (!Array.isArray(definitions.data.results)) return;
    
    const remap: ResultViewProps[] = [];
    for (var r of definitions.data.results) {
      if (!Array.isArray(r.lexicalEntries)) continue;

      for (var e of r.lexicalEntries) {
        if (!Array.isArray(e.entries)) continue;

        for (var n of e.entries) {
          if (!Array.isArray(n.senses)) continue;

          for (var s of n.senses) {
            const toAdd: ResultViewProps = {
              id: r.id,
              word: r.word,
              notes: e.notes,
              definitions: s.definitions,
              examples: s.examples,
              images: images
            };
            remap.push(toAdd);
          }
        }
      }


    }

    setResults(remap);
    
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
