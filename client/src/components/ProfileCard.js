import React from "react";
import { Card, Feed } from "semantic-ui-react";
export default function ProfileCard({ friends }) {
  return (
    <Card.Group>
      <Card fluid style={{ padding: "30px" }}>
        <Card.Group>
          {friends.map((friend) => (
            <Card key={friend.id} className="postCard">
              <Card.Content>
                <Feed>
                  <Feed.Event>
                    <Feed.Label image="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png" />
                    <Feed.Content>
                      <Feed.Summary>{friend.username}</Feed.Summary>
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
