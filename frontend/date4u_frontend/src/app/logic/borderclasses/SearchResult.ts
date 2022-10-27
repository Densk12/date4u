import { Profile } from "src/app/db/model/Profile";

export interface SearchResult {
    profiles: Profile[];
    countAllProfiles: number;
    currentPage: number;
}