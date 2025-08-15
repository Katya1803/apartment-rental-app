import { STORAGE_KEYS } from '../config/constants'
import type { FavouriteItem } from '../types'

export class FavouriteService {
  
  static getFavourites(): FavouriteItem[] {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVOURITES)
    return saved ? JSON.parse(saved) : []
  }

  static getFavouriteIds(): number[] {
    return this.getFavourites().map(item => item.propertyId)
  }

  static addFavourite(propertyId: number): void {
    const favourites = this.getFavourites()
    
    // Check if already exists
    if (favourites.some(item => item.propertyId === propertyId)) {
      return
    }

    const newFavourite: FavouriteItem = {
      propertyId,
      addedAt: new Date().toISOString()
    }

    favourites.push(newFavourite)
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites))
  }

  static removeFavourite(propertyId: number): void {
    const favourites = this.getFavourites()
    const updated = favourites.filter(item => item.propertyId !== propertyId)
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated))
  }

  static isFavourite(propertyId: number): boolean {
    return this.getFavouriteIds().includes(propertyId)
  }

  static toggleFavourite(propertyId: number): boolean {
    if (this.isFavourite(propertyId)) {
      this.removeFavourite(propertyId)
      return false
    } else {
      this.addFavourite(propertyId)
      return true
    }
  }

  static getFavouriteCount(): number {
    return this.getFavourites().length
  }

  static clearAllFavourites(): void {
    localStorage.removeItem(STORAGE_KEYS.FAVOURITES)
  }
}