import { useState } from "react";

function useSubmit(url) {
  const [status, setStatus] = useState("pending");
  let message;

  const data = async (body) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        message = await response.json();
        setStatus("error");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      message = await response.json();
      setStatus("complete");
      return message;
    }
    catch (error) {
      console.error(error);
      return message;
    }
  };

  return { data, status };
}

export default useSubmit;
