import React from 'react';
import Container from 'react-bootstrap/Container';
import { Tabs, Tab } from 'react-bootstrap';
import ResultView from 'ResultView';

interface ResultsPageProps {
  results: Array<any>;
}

function ResultsPage(props: ResultsPageProps) {
  return (
<Container fluid="sm">
  <Tabs>
    {props.results.map((result, i) => (
    <Tab eventKey={i} title={i + 1} key={"result" + i}>
      <ResultView {...result} />
    </Tab>))}
  </Tabs>
</Container>
  );
}

export default ResultsPage;