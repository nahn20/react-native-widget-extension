import { XcodeProject } from "@expo/config-plugins";

import { WidgetFiles } from "../lib/getWidgetFiles";

export function addPbxGroup(
  xcodeProject: XcodeProject,
  {
    targetName,
    widgetFiles,
  }: {
    targetName: string;
    widgetFiles: WidgetFiles;
  }
) {
  const {
    swiftFiles,
    intentFiles,
    otherFiles,
    assetDirectories,
    entitlementFiles,
    plistFiles,
  } = widgetFiles;

  // Add PBX group
  const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup(
    [
      ...swiftFiles,
      ...intentFiles,
      ...otherFiles,
      ...entitlementFiles,
      ...plistFiles,
      ...assetDirectories,
    ],
    targetName,
    targetName
  );

  // Add PBXGroup to top level group
  const groups = xcodeProject.hash.project.objects["PBXGroup"];
  if (pbxGroupUuid) {
    Object.keys(groups).forEach(function (key) {
      const value = groups[key];

      // This is a hacky fix to avoid adding AppClip. There was an issue in EAS for "The file reference for "Info.plist" is a member of multiple groups ("...Clip" and "...Widgets"); this indicates a malformed project.""
      if(typeof value === "object" || (typeof value === "string" && value.endsWith("Clip"))) return;

      if (value.name === undefined && value.path === undefined) {
        xcodeProject.addToPbxGroup(pbxGroupUuid, key);
      }
    });
  }
}
