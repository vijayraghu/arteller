window.addEventListener('load', function() {
  var menu_open = false;

  window.awe.init({
    device_type: awe.AUTO_DETECT_DEVICE_TYPE,
    settings: {
      container_id: 'container',
      fps: 30,
      default_camera_position: { x:0, y:0, z:0 },
      default_lights: [{
        id: 'point_light',
        type: 'point',
        color: 0xFFFFFF
      }]
    },
    ready: function() {
      awe.util.require([
        {
          capabilities: ['gum','webgl'],
          files: [ 
            ['lib/awe-standard-dependencies.js', 'lib/awe-standard.js'],
            'lib/awe-standard-window_resized.js',
            'lib/awe-standard-object_clicked.js',
            'lib/awe-jsartoolkit-dependencies.js',
            'lib/awe.marker_ar.js'
          ],
          success: function() {
            window.awe.setup_scene();

            // Points of Interest
            awe.pois.add({id: 'marker', position: {x: 0, y: 0, z: 10000}, visible: false});

            // Projections
            awe.projections.add({ 
              id: 'wormhole',
              geometry: {shape: 'plane', height: 400, width: 400},
              position: {x: 0, y: 0, z: 0},
              rotation: {x: 90, z: 45},
              material: {
                type: 'phong',
                color: 0x000000
              }
            }, {poi_id: 'marker'});

        awe.projections.add({
          id: 'account_balance',
          geometry: {shape: 'text', text: "Account Balance", parameters: {size: 20, height: 8, curveSegments: 2, font: "helvetiker"}},
          rotation: {x: 180, y: 0, z: 0},
          position: {x: -5, y: -31, z: -5},
          material: {
            type: 'phong', 
            color: 0xFF0000
          }
        }, {poi_id: 'marker'});

        awe.projections.add({
          id: 'last_transfer',
          geometry: {shape: 'text', text: "Last Transfer", parameters: {size: 20, height: 8, curveSegments: 2, font: "helvetiker"}},
          rotation: {x: 180, y: 0, z: 0},
          position: {x: -5, y: -31, z: -5},
          material: {
              type: 'phong',
            color: 0xFFFF00
          }
        }, {poi_id: 'marker'});

        awe.projections.add({
          id: 'last_purchase',
          geometry: {shape: 'text', text: "Last Purchase", parameters: {size: 20, height: 8, curveSegments: 2, font: "helvetiker"}},
          rotation: {x: 180, y: 0, z: 0},
          position: {x: -5, y: -31, z: -5},
          material: {
            type: 'phong',
            color: 0xFFFFFF
          }
        }, {poi_id: 'marker'});

            awe.events.add([{
              id: 'ar_tracking_marker',
              device_types: {
                pc: 1,
                android: 1
              },
              register: function(handler) {
                window.addEventListener('ar_tracking_marker', handler, false);
              },
              unregister: function(handler) {
                window.removeEventListener('ar_tracking_marker', handler, false);
              },
              handler: function(event) {
                if (event.detail) {
                  if (event.detail['64']) {
                    awe.pois.update({
                      data: {
                        visible: true,
                        position: {x: 0, y: 0, z: 0},
                        matrix: event.detail['64'].transform
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                    awe.projections.update({
                      data: {
                        visible: true
                      },
                      where: {
                        id: 'wormhole'
                      }
                    });
                  } else if (menu_open) {
                    awe.projections.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'wormhole'
                      }
                    });
                  }
                  else {
                    awe.pois.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                  }
                  awe.scene_needs_rendering = 1;
                }
              }
            }]);

        window.addEventListener('object_clicked', function(e) {
          switch (e.detail.projection_id) {
            case 'wormhole':
              if (!menu_open) {
                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: 175}
                  },
                  where: {id: 'account_balance'}
                });

                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: 210}
                  },
                  where: {id: 'last_transfer'}
                });

                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: 245}
                  },
                  where: {id: 'last_purchase'}
                });

              } else {
                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: -31}
                  },
                  where: {id: 'account_balance'}
                });

                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: -31}
                  },
                  where: {id: 'last_transfer'}
                });

                awe.projections.update({
                  data: {
                    animation: {
                      duration: 1
                    },
                    position: {y: -31}
                  },
                  where: {id: 'last_purchase'}
                });
              }

              menu_open = !menu_open;
            break;
            case 'account_balance':
            case 'last_transfer':
            case 'last_purchase':
              document.body.innerHTML = '<p>This is a test of ARTeller</p>';
            break;
          }
        }, false);
      } // success()
    },
    {
      capabilities: [],
      success: function() { 
        document.body.innerHTML = '<p>Try this demo in the latest version of Chrome or Firefox on a PC or Android device</p>';
      }
    }
  ]); // awe.util.require()
} // ready()
}); // window.awe.init()
}); // load
