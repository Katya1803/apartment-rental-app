// src/services/favoritesService.ts
import { STORAGE_KEYS } from '../config/constants'

export class FavoritesService {
  
  // Get all favorite property IDs
  static getFavorites(): number[] {
    try {
      const favorites = localStorage.getItem(STORAGE_KEYS.FAVOURITES)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error reading favorites:', error)
      return []
    }
  }

  // Check if property is favorited
  static isFavorite(propertyId: number): boolean {
    const favorites = this.getFavorites()
    return favorites.includes(propertyId)
  }

  // Add property to favorites
  static addFavorite(propertyId: number): void {
    try {
      const favorites = this.getFavorites()
      if (!favorites.includes(propertyId)) {
        favorites.push(propertyId)
        localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favorites))
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))
      }
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  // Remove property from favorites
  static removeFavorite(propertyId: number): void {
    try {
      const favorites = this.getFavorites()
      const updatedFavorites = favorites.filter(id => id !== propertyId)
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updatedFavorites))
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  // Toggle favorite status
  static toggleFavorite(propertyId: number): boolean {
    if (this.isFavorite(propertyId)) {
      this.removeFavorite(propertyId)
      return false
    } else {
      this.addFavorite(propertyId)
      return true
    }
  }

  // Get favorites count
  static getFavoritesCount(): number {
    return this.getFavorites().length
  }

  // Clear all favorites
  static clearFavorites(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.FAVOURITES)
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error clearing favorites:', error)
    }
  }
}