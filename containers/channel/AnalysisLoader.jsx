import { Card, Col, Spinner } from "react-bootstrap";
import React, { useState } from "react";

const AnalysisLoader = () => {
  return (
    <Col key={0} md={6} lg={4}>
      <Card className="mb-3 shadow-sm border-0">
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Preparing analysis... This may take some time.</p>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AnalysisLoader;
