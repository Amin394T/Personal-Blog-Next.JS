import { useState, useEffect } from "react";

const cache = {};

function useFetch(url, cacheData = true) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (cache[url] && cacheData) {
      setData(cache[url]);
      setStatus("complete");
    }
    else {
      let fetchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          if (response.headers.get("content-type") == "text/html") throw new Error("File Not Found!");

          const data = await response.text();
          if(cacheData) cache[url] = data;
          setData(data);
          setStatus("complete");
        }
        catch (error) {
          console.error(error);
          setStatus("error");
        }
      };
      fetchData();
    }
  }, [url, cacheData]);

  return { data, status };
}

export default useFetch;
