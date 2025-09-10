import React from 'react'
import {
  Grid,
  Stack,
  Typography,
  Box
} from '@mui/material'
import {
  Wifi,
  AcUnit,
  LocalLaundryService,
  Kitchen,
  Tv,
  LocalParking,
  FitnessCenter,
  Pool,
  Elevator,
  Security,
  Pets,
  SmokeFree,
  Balcony,
  CheckCircle,
  Power,
  Opacity,
  LocalGasStation,
  CleaningServices,
  Build,
  Delete,
  Countertops,
  Weekend,
  Bed,
  Chair,
  Bathtub,
  Shower,
  Microwave,
  TableRestaurant,
  Book,
  ContentCut,
  Mail,
  HelpOutline
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { Amenity, Locale } from '../../types'

interface PropertyAmenitiesProps {
  amenities: Amenity[]
}

const getAmenityIcon = (key: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    // ----- Included Services (IS_*) -----
    IS_electricity: <Power />,
    IS_water: <Opacity />,
    IS_wifi: <Wifi />,
    IS_cable_tv: <Tv />,
    IS_gas: <LocalGasStation />,
    IS_building_management: <Security />,
    IS_security_service: <Security />,
    IS_cleaning_service: <CleaningServices />,
    IS_maintenance_service: <Build />,
    IS_garbage_collection: <Delete />,
    IS_laundry_service: <LocalLaundryService />,
    IS_parking_included: <LocalParking />,
    IS_reception_service: <Pets />, // tạm icon con người, anh muốn em đổi?
    IS_mail_service: <Mail />,
    IS_backup_power: <Power />,

    // ----- Interior Facilities (IF_*) -----
    IF_kitchen: <Kitchen />,
    IF_microwave: <Microwave />,
    IF_dining_table: <TableRestaurant />,
    IF_cooking_utensils: <Countertops />,
    IF_sofa: <Weekend />,
    IF_television: <Tv />,
    IF_coffee_table: <TableRestaurant />,
    IF_bookshelf: <Book />,
    IF_bed: <Bed />,
    IF_wardrobe: <Chair />,
    IF_desk: <Chair />,
    IF_chair: <Chair />,
    IF_private_bathroom: <Bathtub />,
    IF_shower: <Shower />,
    IF_bathtub: <Bathtub />,
    IF_air_conditioning: <AcUnit />,
    IF_balcony: <Balcony />,
    IF_washing_machine: <LocalLaundryService />,
    IF_closet: <Chair />,
    IF_mirror: <ContentCut />
  }

  return iconMap[key] || <HelpOutline />
}

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities }) => {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language as Locale

  const getAmenityLabel = (amenity: Amenity) => {
    return amenity.translations?.[currentLocale] || 
           amenity.translations?.['vi'] || 
           amenity.translations?.['en'] || 
           amenity.label || 
           amenity.key
  }

  if (amenities.length === 0) {
    return (
      <Typography color="text.secondary">
        No amenities listed
      </Typography>
    )
  }

  return (
    <Grid container spacing={3}>
      {amenities.map((amenity) => (
        <Grid item xs={12} sm={6} md={4} key={amenity.id}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                flexShrink: 0
              }}
            >
              {getAmenityIcon(amenity.key)}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {getAmenityLabel(amenity)}
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}

export default PropertyAmenities
