import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMapView = forwardRef(({ style, region, markerCoordinate }, ref) => {
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${region?.latitude || 0}, ${region?.longitude || 0}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        
        var marker;
        ${markerCoordinate ? `
          marker = L.marker([${markerCoordinate.latitude}, ${markerCoordinate.longitude}]).addTo(map);
        ` : ''}

        document.addEventListener('message', function(e) {
          try {
            var data = JSON.parse(e.data);
            if(data.type === 'setRegion') {
              map.setView([data.region.latitude, data.region.longitude], 14);
              if(data.markerCoordinate) {
                if(!marker) {
                   marker = L.marker([data.markerCoordinate.latitude, data.markerCoordinate.longitude]).addTo(map);
                } else {
                   marker.setLatLng([data.markerCoordinate.latitude, data.markerCoordinate.longitude]);
                }
              }
            }
          } catch (err) {}
        });
      </script>
    </body>
    </html>
  `;

  const updateRegion = (newRegion, newMarker) => {
    const data = JSON.stringify({ type: 'setRegion', region: newRegion, markerCoordinate: newMarker });
    webViewRef.current?.injectJavaScript(`
      document.dispatchEvent(new MessageEvent('message', {data: '${data}'}));
      true;
    `);
  };

  useEffect(() => {
    if (region) {
      updateRegion(region, markerCoordinate);
    }
  }, [region, markerCoordinate]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (newRegion) => {
      updateRegion(newRegion, markerCoordinate);
    }
  }));

  if (Platform.OS === 'web') {
    return (
      <View style={[style, styles.webFallback]}>
         <iframe 
            style={{ width: '100%', height: '100%', border: 'none' }}
            srcDoc={htmlContent}
         />
      </View>
    );
  }

  return (
    <View style={style}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        scrollEnabled={false}
      />
    </View>
  );
});

export default LeafletMapView;

const styles = StyleSheet.create({
  webFallback: {
    backgroundColor: '#e0e0e0',
    overflow: 'hidden'
  }
});
