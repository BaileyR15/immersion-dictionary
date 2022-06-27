import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

export interface ResultViewProps {
  id: string;
  word: string;
  notes: {text: string}[];
  definitions: string[];
  examples: {text: string}[];
  images: string[];
}

export function ResultView(props: ResultViewProps) {
  
  return (
<Container fluid="sm">
  <Row>
    {props.word}
  </Row>
  {props.definitions.map((def, i) => (
  <Row key={"def" + i}>
    {def}
  </Row>
  ))}
  <Row key="image-row">
    <Col>
      {props.images.map((img, i) => (
      <Image src={img} fluid height="100" width="100" key={"img" + i} />
      ))}
    </Col>
  </Row>
  {props.examples && props.examples.map((ex, i) => (
  <Row key={"ex" + i}>
    {ex.text}
  </Row>
  ))}
</Container>
  );
}

export default ResultView;