// src/types/google-maps.d.ts
declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions)
      setCenter(latlng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener
      panTo(latlng: LatLng | LatLngLiteral): void
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      setPosition(latlng: LatLng | LatLngLiteral): void
      setMap(map: Map | null): void
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener
      getPosition(): LatLng | undefined
      setDraggable(draggable: boolean): void
      setTitle(title: string): void
      setIcon(icon: string | Icon | Symbol): void
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
      toString(): string
      toJSON(): LatLngLiteral
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      mapTypeControl?: boolean
      streetViewControl?: boolean
      fullscreenControl?: boolean
      zoomControl?: boolean
      gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto'
      mapTypeId?: MapTypeId
      clickableIcons?: boolean
      disableDefaultUI?: boolean
      scrollwheel?: boolean
      styles?: MapTypeStyle[]
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map | null
      title?: string
      draggable?: boolean
      icon?: string | Icon | Symbol
      label?: string | MarkerLabel
      clickable?: boolean
      cursor?: string
      opacity?: number
      visible?: boolean
      zIndex?: number
    }

    interface MapMouseEvent {
      latLng?: LatLng
      domEvent?: MouseEvent
      pixel?: Point
    }

    interface MapsEventListener {
      remove(): void
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string)
      width: number
      height: number
    }

    class Point {
      constructor(x: number, y: number)
      x: number
      y: number
    }

    interface Icon {
      url: string
      size?: Size
      origin?: Point
      anchor?: Point
      scaledSize?: Size
      labelOrigin?: Point
    }

    interface Symbol {
      path: string | SymbolPath
      anchor?: Point
      fillColor?: string
      fillOpacity?: number
      labelOrigin?: Point
      rotation?: number
      scale?: number
      strokeColor?: string
      strokeOpacity?: number
      strokeWeight?: number
    }

    interface MarkerLabel {
      text: string
      color?: string
      fontFamily?: string
      fontSize?: string
      fontWeight?: string
      className?: string
    }

    enum MapTypeId {
      HYBRID = 'hybrid',
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      TERRAIN = 'terrain'
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW = 0,
      BACKWARD_OPEN_ARROW = 1,
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 2,
      FORWARD_OPEN_ARROW = 3
    }

    interface MapTypeStyle {
      elementType?: string
      featureType?: string
      stylers?: MapTypeStyler[]
    }

    interface MapTypeStyler {
      color?: string
      gamma?: number
      hue?: string
      invert_lightness?: boolean
      lightness?: number
      saturation?: number
      visibility?: string
      weight?: number
    }

    // Places API types
    namespace places {
      class PlacesService {
        constructor(map: Map | HTMLDivElement)
        findPlaceFromQuery(request: FindPlaceFromQueryRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void
        nearbySearch(request: PlaceSearchRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void
        textSearch(request: TextSearchRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void
        getDetails(request: PlaceDetailsRequest, callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void): void
      }

      interface FindPlaceFromQueryRequest {
        query: string
        fields: string[]
        locationBias?: LatLng | LatLngLiteral | LatLngBounds
      }

      interface PlaceSearchRequest {
        location?: LatLng | LatLngLiteral
        radius?: number
        keyword?: string
        name?: string
        type?: string
        bounds?: LatLngBounds
      }

      interface TextSearchRequest {
        query: string
        location?: LatLng | LatLngLiteral
        radius?: number
        bounds?: LatLngBounds
      }

      interface PlaceDetailsRequest {
        placeId: string
        fields?: string[]
      }

      interface PlaceResult {
        place_id?: string
        name?: string
        formatted_address?: string
        geometry?: PlaceGeometry
        rating?: number
        types?: string[]
        vicinity?: string
      }

      interface PlaceGeometry {
        location?: LatLng
        viewport?: LatLngBounds
      }

      enum PlacesServiceStatus {
        OK = 'OK',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        ZERO_RESULTS = 'ZERO_RESULTS',
        NOT_FOUND = 'NOT_FOUND'
      }
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral)
      contains(latLng: LatLng | LatLngLiteral): boolean
      extend(point: LatLng | LatLngLiteral): LatLngBounds
      getCenter(): LatLng
      getNorthEast(): LatLng
      getSouthWest(): LatLng
    }
  }
}

export {}