"use client";
import React, { ChangeEvent, Fragment, useState } from "react";
import Input from "../components/input/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Textarea from "../components/input/Textarea";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const EditorForm = (props: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<String[]>([]);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      body: "",
    },
  });

  const handleAddTag = () => {
    setTags([...tags, inputValue]);
    setInputValue("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const deleteTag = (title: String) => {
    const tag = tags.filter((i) => i !== title);
    setTags(tag);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/articles", {
        articles: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: tags,
        },
      });

      if (response.status === 200) {
        reset();
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.errors[0] || "An error occurred";
        console.error("Error fetching profile:", errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              <li>{error}</li>
            </ul>

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <Input
                    placeholder="Article Title"
                    register={register}
                    id="title"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <Input
                    placeholder="What's this article about?"
                    register={register}
                    id="description"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <Textarea
                    placeholder="Write your article (in markdown)"
                    register={register}
                    id="body"
                    rows={8}
                  />
                </fieldset>
                <fieldset className="form-group ">
                  <div className="flex items-center mb-2">
                    <input
                      className="form-control form-control-lg"
                      placeholder="Enter tags"
                      onChange={handleInputChange}
                      value={inputValue}
                    />
                    <button
                      className="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      onClick={handleAddTag}
                    >
                      Add tag
                    </button>
                  </div>

                  <div className="tag-list">
                    {tags.length > 0 &&
                      tags.map((tag, index) => (
                        <Fragment key={index}>
                          <span
                            className="tag-default tag-pill"
                            onClick={() => deleteTag(tag)}
                          >
                            <i className="ion-close-round"></i> {tag}
                          </span>
                        </Fragment>
                      ))}
                  </div>
                </fieldset>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  disabled={isLoading}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
