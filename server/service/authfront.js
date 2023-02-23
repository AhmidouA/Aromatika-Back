const login = async (username, password) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    if (!response.ok) {
      throw new Error('Failed to log in');
    }
  
    const { accessToken, refreshToken } = await response.json();
  
    // Store the tokens securely in the client-side storage
    // ...
  
    return { accessToken, refreshToken };
  };
  
  // Example
  login('johndoe', 'password')
    .then(tokens => console.log(tokens))
    .catch(error => console.error(error));
  