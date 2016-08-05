# TYkdd7fw3uDDuHL5 password
import subprocess

# import glob
# stringOfFiles = ''
# for i, val in enumerate(glob.glob("*_dem.tif")):
#     stringOfFiles += ' ' + val

# print ( stringOfFiles )
# val = 'gdalbuildvrt master.vrt' + stringOfFiles
# val = 'gdalwarp master.vrt masterAlaska.tif'
# val = 'gdalwarp -te -153.7451997 59.4849066 -151.7451997 61.4849066 master.vrt masterAlaska.tif' # -te x_min y_min x_max y_max  popo 19.023296, -98.628135
# val = 'gdalinfo -mm masterAlaska.tif' #checks the file info
# val = 'gdal_translate -scale 0 2470 0 65535 -ot UInt16 -of PNG masterAlaska.tif final.png'
# val = 'gdal_translate -scale 0 2470 0 65535 -ot UInt16 -outsize 400 400 -of ENVI masterAlaska.tif final.bin'
# val = 'gdaldem color-relief masterAlaska.tif color_relief.txt clippedRelief.tif'
# val = 'gdaldem hillshade -combined masterAlaska.tif clippedHillShade.tif'
val = 'gdaldem slope -combined masterAlaska.tif clippedSlopeShade.tif'
valBroken = val.split(' ')
#
subprocess.call(valBroken)
