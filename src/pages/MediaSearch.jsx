import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";
import { Grid } from "@mui/material";


const mediaTypes = ["movie", "tv", "people"]
let timer;
const timeout = 500;

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  const search = useCallback(async () => {
    setOnSearch(true);

    const { response, err } = await mediaApi.search({
      query,
      mediaType,
      page
    });

    setOnSearch(false);

    if (err) toast.error(err.message);

    if (response) {
      if (page > 1) setMedias(m => [...m, ...response.results]);
      else setMedias([...response.results]);
    }
  }, [query, mediaType, page]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
    } else search();
  }, [query, search, mediaType]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuery(newQuery);
    }, timeout);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent={"center"}
            sx={{ width: "100%", flexWrap: "wrap", marginBottom: "0.7rem" }}
          >
            {mediaTypes.map((item, index) => (
              <Button
                key={index}
                variant={mediaType === item ? "contained" : "outlined"}
                onClick={() => onCategoryChange(item)}
                sx={{ textTransform: "capitalize" }}
              >
                {item}
              </Button>
            ))}
          </Stack>
          <TextField
            label="Search"
            variant="outlined"
            onChange={onQueryChange}
            sx={{ width: "100%" }}
          />

          <Grid sx={{ marginRight: "-1rem" }}>
            <MediaGrid medias={medias} mediaType={mediaType} />
          </Grid>

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              onClick={() => setPage(page + 1)}
            >
              load more
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  )
}

export default MediaSearch