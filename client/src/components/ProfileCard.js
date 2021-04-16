import React from "react";
import { Card, Feed, Grid, Image } from "semantic-ui-react";
export default function ProfileCard({ friends, props }) {
  return (
    <Card.Group>
      <Card fluid style={{ padding: "30px" }}>
        <Card.Group>
          <Grid columns={3}>
            {[...Array(friends.length >= 6 ? 6 : friends.length)].map(
              (x, i) => (
                <Grid.Column key={friends[i].id}>
                  <Card
                    className="profileCard"
                    onClick={() =>
                      props.history.push(`/profile/${friends[i].id}`)
                    }
                  >
                    <Card.Content>
                      <Feed>
                        <Feed.Event>
                          <Feed.Content>
                            <Image
                              src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
                              size="tiny"
                              centered
                            />
                            <Feed.Summary style={{ textAlign: "center" }}>
                              {friends[i].username}
                            </Feed.Summary>
                          </Feed.Content>
                        </Feed.Event>
                      </Feed>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              )
            )}
          </Grid>
        </Card.Group>
      </Card>
    </Card.Group>
  );
}
