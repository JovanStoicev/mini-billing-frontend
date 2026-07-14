const API_BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error("Не мога да се свържа с backend-а. Провери дали Spring Boot е стартиран на http://localhost:8080.");
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  return response.json();
}

export function getUser(referenceNumber, inputDirectory) {
  return request(`/users/${encodeURIComponent(referenceNumber)}?inputDirectory=${encodeURIComponent(inputDirectory)}`);
}

export function getReadings(referenceNumber, inputDirectory) {
  return request(
    `/users/${encodeURIComponent(referenceNumber)}/readings?inputDirectory=${encodeURIComponent(inputDirectory)}`
  );
}

export function getProducts(referenceNumber, inputDirectory) {
  return request(
    `/users/${encodeURIComponent(referenceNumber)}/products?inputDirectory=${encodeURIComponent(inputDirectory)}`
  );
}

export function previewInvoice(referenceNumber, payload) {
  return request(`/users/${encodeURIComponent(referenceNumber)}/live`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}