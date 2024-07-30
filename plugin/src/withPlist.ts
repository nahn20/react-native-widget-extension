import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, withDangerousMod, withInfoPlist } from "@expo/config-plugins";

export const withPlist: ConfigPlugin<{ frequentUpdates: boolean }> = (
  config,
  { frequentUpdates }
) => {
    return withInfoPlist(config, (config) => {
        config.ios = {
            ...config.ios,
            infoPlist: {
                ...config.ios?.infoPlist,
                NSSupportsLiveActivities: true,
                NSSupportsLiveActivitiesFrequentUpdates: frequentUpdates,
            },
        }
        return config
    })
};
