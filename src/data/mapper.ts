import { mockedElements } from "./mocked-elements";

export const mockedNearElements = mockedElements
  .filter((el) => el.element_type !== "situated_event")
  .map((el) => ({
    id: el.element_id,
    title: el.name,
    image: "", // agora deve vir de media
    rating: "rating" in el ? el.rating?.value ?? 0 : 0,
  }));