export function getPostHeader():RequestInit{
  return {
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json'
    }
  };
}
export function getPostHeaderAuthorized(username:string, password:string):RequestInit{
  return {
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export function getPatchHeader(username:string, password:string):RequestInit{
  return {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export function getDeleteHeader(username:string, password:string):RequestInit{
  return {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export async function handleResponse(response: Response): Promise<any> {
  console.log(response)
  if (response.ok) {
    return response.text();
  }

  const errorText = await response.text();
  console.log('Error caught in Service:', response.status, errorText);
  return { error: response.status, errorText };
}
