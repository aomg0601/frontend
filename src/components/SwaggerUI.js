// src/components/SwaggerUI.js
import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerComponent = () => {
  return <SwaggerUI url="http://ec2-3-34-137-42.ap-northeast-2.compute.amazonaws.com:8080/v3/api-docs" />;
};

export default SwaggerComponent;
