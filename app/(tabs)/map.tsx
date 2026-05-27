/**
 * FILE: app/(tabs)/map.tsx
 * PURPOSE: Map screen scaffold. Initializes @rnmapbox/maps with correct token and config.
 *   This is the foundation. Full map features (markers, filters, place cards) build on this.
 * DEPENDS ON: @rnmapbox/maps, lib/tokens.ts for map config and colors.
 *   EXPO_PUBLIC_MAPBOX_TOKEN must start with pk. (public token, not sk.)
 *   The RNMapboxMapsVersion in app.json pins the native SDK version — build time only.
 * USED BY: app/(tabs)/_layout.tsx tab navigation.
 * IF SOMETHING BREAKS HERE:
 *   1. Confirm EXPO_PUBLIC_MAPBOX_TOKEN starts with pk. (not sk.)
 *   2. Confirm this is running in a development build, not Expo Go.
 *      @rnmapbox/maps does not work in Expo Go. EAS development build required.
 *   3. Check that RNMapboxMapsVersion in app.json is set correctly.
 */

import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { colors, mapConfig } from '../../lib/tokens';
import { useAuth } from '../../lib/auth-context';

// Initialize Mapbox with the public token (pk. prefix required)
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

export default function MapScreen() {
  const { user } = useAuth();
  const cameraRef = useRef<MapboxGL.Camera>(null);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Light}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={[mapConfig.defaultLng, mapConfig.defaultLat]}
          zoomLevel={mapConfig.defaultZoom}
          animationMode="none"
        />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  map: {
    flex: 1,
  },
});
