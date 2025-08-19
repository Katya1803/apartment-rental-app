// app-frontend/src/components/property/PropertyAmenities.tsx
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
  CheckCircle
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { Amenity, Locale } from '../../types'

interface PropertyAmenitiesProps {
  amenities: Amenity[]
}

const getAmenityIcon = (key: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    wifi: <Wifi />,
    air_conditioning: <AcUnit />,
    washing_machine: <LocalLaundryService />,
    kitchen: <Kitchen />,
    tv: <Tv />,
    parking: <LocalParking />,
    gym: <FitnessCenter />,
    pool: <Pool />,
    elevator: <Elevator />,
    security: <Security />,
    pets_allowed: <Pets />,
    no_smoking: <SmokeFree />,
    balcony: <Balcony />,
    // Building management
    building_management: <Security />,
    tap_water: <Wifi />,
    internet: <Wifi />,
    cable_tv: <Tv />,
    housekeeping: <LocalLaundryService />,
    normal_laundry: <LocalLaundryService />,
    tax: <CheckCircle />
  }
  
  return iconMap[key] || <CheckCircle />
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
                bgcolor: 'primary.light',
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