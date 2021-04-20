import React from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";

export default function Messages() {
  const { username } = useParams();
  return (
    <Grid style={{ marginTop: 50 }}>
      <Grid.Row>
        <Grid.Column width={5} style={{ padding: 0 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                border: "1px groove rgba(224, 224, 224,0.5)",
                textAlign: "center",
              }}
            >
              <h3>username</h3>
            </div>
            <div
              style={{
                border: "1px groove rgba(224, 224, 224,0.5)",
                textAlign: "center",
              }}
            >
              <h3>username</h3>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={10} style={{ padding: 0 }}>
          <div
            style={{
              border: "1px groove rgba(224, 224, 224,0.5)",
              textAlign: "center",
            }}
          >
            <h3>uiop</h3>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
