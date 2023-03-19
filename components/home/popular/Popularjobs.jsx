import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import styles from "./popularjobs.style";
import PopularJobCard from "../../common/cards/popular/PopularJobCard";
import { COLORS, SIZES } from "../../../constants";
import { useQuery } from "react-query";
import { api } from "../../../axios";

const Popularjobs = () => {
  const jobsQuery = useQuery("jobs", async () => {
    const { data } = await api({
      url: "/search",
      params: {
        query: "React Developer",
        page: "1",
        num_pages: "1",
      },
    });
    return data?.data;
  });
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular jobs</Text>
        <TouchableOpacity>
          <Text>Show All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {jobsQuery.isLoading && (
          <ActivityIndicator size="large" color={COLORS.primary} />
        )}
        {jobsQuery.isError && <Text>Something is wrong</Text>}
        {jobsQuery.data && (
          <FlatList
            data={jobsQuery?.data}
            key={(item) => item?.job_id}
            horizontal
            renderItem={({ item }) => (
              <PopularJobCard
                item={item}
                handleCardPress={() =>
                  router.push(`/job-details/${item?.job_id}`)
                }
              />
            )}
            contentContainerStyle={{
              columnGap: SIZES.medium,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Popularjobs;
