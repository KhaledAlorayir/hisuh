import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Name {
  name: string;
}

const getDetails = async (place_id: string) => {
  const { data } = await axios.get(`/api/place/${place_id}`);
  return data;
};

const useGetPlaceDetails = () => {
  return useMutation<Name, unknown, string>({
    mutationFn: getDetails,
  });
};

export default useGetPlaceDetails;
