import { useState, useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';
import mediaApi from '../../api/modules/media.api';
import AutoSwiper from './AutoSwiper';
import { toast } from 'react-toastify';
import MediaItem from './MediaItem';


const MediaSlide = ({ mediaType, mediaCategory }) => {
    const [medias, setMediaS] = useState([]);

    useEffect(() => {
        const getMedias = async () => {
            const { response, error } = await mediaApi.getList({ mediaType, mediaCategory, page: 1 });

            if (response) setMediaS(response.results);
            if (error) toast.error(error);
        }

        getMedias();
    }, [mediaType, mediaCategory]);

    return (
        <AutoSwiper>
            {medias.map((media, index) => (
                <SwiperSlide key={index}>
                    <MediaItem media={media} mediaType={mediaType} />
                </SwiperSlide>
            ))}
        </AutoSwiper>
    )
}

export default MediaSlide