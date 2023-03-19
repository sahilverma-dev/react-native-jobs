import styles from "./nearbyjobs.style";

import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { useRouter } from "expo-router";

import { COLORS, SIZES } from "../../../constants";
import { useQuery } from "react-query";
import { api } from "../../../axios";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";

const Nearbyjobs = () => {
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
          <>
            {jobsQuery?.data?.map((job) => (
              <NearbyJobCard
                job={job}
                key={job?.job_id}
                handleNavigate={() =>
                  router.push(`/job-details/${job?.job_id}`)
                }
              />
            ))}
          </>
        )}
      </View>
    </View>
  );
};

export default Nearbyjobs;
