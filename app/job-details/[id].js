import { useState } from "react";

// expo router
import { Stack, useRouter, useSearchParams } from "expo-router";

// react native
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

// custom components
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";

// axios and react query
import { api } from "../../axios";
import { useQuery } from "react-query";

// react native gesture
import { RefreshControl } from "react-native-gesture-handler";

// constants
import { COLORS, SIZES, icons } from "../../constants";
const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useSearchParams();
  const router = useRouter();

  const jobsQuery = useQuery([params.id], async () => {
    const { data } = await api({
      url: "/job-details",
      params: {
        job_id: params.id,
      },
    });
    return data?.data[0];
  });

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <Specifics
            title="Qualifications"
            points={jobsQuery.data?.job_highlights?.Qualifications ?? ["N/A"]}
          />
        );

      case "About":
        return (
          <JobAbout
            info={jobsQuery.data?.job_description ?? "No data provided"}
          />
        );

      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={jobsQuery.data?.job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl onRefresh={jobsQuery.refetch} />}
          style={{
            flex: jobsQuery?.isLoading ? 1 : 0,
          }}
          contentContainerStyle={
            jobsQuery?.isLoading && {
              flex: 1,
              alignItems: "center",
            }
          }
        >
          {jobsQuery.isLoading && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          {jobsQuery.isError && <Text>Something is wrong</Text>}
          {jobsQuery.data && (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={jobsQuery.data?.employer_logo}
                jobTitle={jobsQuery.data?.job_title}
                companyName={jobsQuery.data?.employer_name}
                location={jobsQuery.data?.job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        {jobsQuery.data && (
          <JobFooter
            url={
              jobsQuery.data?.job_google_link ??
              "https://careers.google.com/jobs/results/"
            }
          />
        )}
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
