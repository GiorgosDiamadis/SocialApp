import React from "react";
import { Card, Feed } from "semantic-ui-react";
export default function ProfileCard({ friends, props }) {
  return (
    <Card.Group>
      <Card fluid style={{ padding: "30px" }}>
        <Card.Group>
          {[...Array(friends.length >= 4 ? 4 : friends.length)].map((x, i) => (
            <Card
              key={friends[i].id}
              className="profileCard"
              onClick={() => props.history.push(`/profile/${friends[i].id}`)}
            >
              <Card.Content>
                <Feed>
                  <Feed.Event>
                    <Feed.Label image="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png" />
                    <Feed.Content>
                      <Feed.Summary>{friends[i].username}</Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Card>
    </Card.Group>
  );
}
