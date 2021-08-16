import { SearchController } from "./search/search";
import { UserRatingController } from "./user-rating/user-rating";

const userRatingController = new UserRatingController();
const searchController = new SearchController();

export {
  userRatingController,
  searchController
};
