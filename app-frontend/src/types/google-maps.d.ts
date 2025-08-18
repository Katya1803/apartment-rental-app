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
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      setPosition(latlng: LatLng | LatLngLiteral): void
      setMap(map: Map | null): void
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
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
      gestureHandling?: string
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map
      title?: string
      draggable?: boolean
      icon?: any
    }

    interface MapMouseEvent {
      latLng?: LatLng
    }

    interface MapsEventListener {
      remove(): void
    }

    class Size {
      constructor(width: number, height: number)
    }

    class Point {
      constructor(x: number, y: number)
    }
  }
}

export {}