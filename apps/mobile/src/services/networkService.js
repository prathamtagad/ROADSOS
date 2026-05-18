import NetInfo from "@react-native-community/netinfo";

export function listenToNetworkStatus(onChange) {
  return NetInfo.addEventListener((state) => {
    onChange(!!state.isConnected && !!state.isInternetReachable);
  });
}
