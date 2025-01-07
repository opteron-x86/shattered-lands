import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();

  // We'll store the "User" record from DynamoDB here
  const [dbUser, setDbUser] = useState<Schema['User']['type'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the user is not signed in yet, do nothing
    if (!user) return;

    // The Cognito username might be in user.username or user.signInDetails.loginId, 
    // depending on your configuration. Adjust as needed:
    const cognitoUsername = user.signInDetails?.loginId || user.username || 'Unknown';

    // 1) Try to find an existing record in the "User" model with matching username
    //    (In a real app, you might store the Cognito "sub" instead, to ensure uniqueness).
    const subscription = client.models.User
      .observeQuery((u) => u.username('eq', cognitoUsername))
      .subscribe({
        next: async (snapshot) => {
          const items = snapshot.items;
          if (items.length > 0) {
            // Found existing user in DB
            setDbUser(items[0]);
            setLoading(false);
          } else {
            // No record found, create one
            const newRecord = await client.models.User.create({
              username: cognitoUsername,
            });
            setDbUser(newRecord);
            setLoading(false);
          }
        },
        error: (err) => {
          console.error('Failed to query User:', err);
          setLoading(false);
        },
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (!user) {
    // If the user is not logged in, you might show a loading screen or a sign-in page
    return <p>Please sign in...</p>;
  }

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <main>
      <h1>Welcome, {dbUser?.username || 'New User'}!</h1>
      <p>Signed in via Cognito ID: {user?.signInDetails?.loginId}</p>

      <p>
        Here’s a basic “user dashboard.” In the future, you can display fiefdoms,
        resources, or other game data linked to this user record.
      </p>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
